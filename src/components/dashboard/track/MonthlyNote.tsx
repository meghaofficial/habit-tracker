import { useEffect, useRef, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

import { formatTimestamp, notify } from "../../../helper";
import { socket } from "../../../socket/socket";

import {
  getMonthlyNote,
  updateMonthlyNote,
} from "../../../api/dashboard.api";

import Saving from "../../shared/Saving";
import SectionIcon from "../../shared/SectionIcon";

const MonthlyNote = ({ monthID }: { monthID: string }) => {
  const [monthlyNote, setMonthlyNote] = useState("");
  const [lastUpdated, setLastUpdates] = useState("");

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  // --------------------------------------------------
  // Refs
  // --------------------------------------------------

  // Last value confirmed by the server
  const serverNoteRef = useRef("");

  // Latest value currently typed by the user
  const latestNoteRef = useRef("");

  // Prevent multiple saves from running simultaneously
  const isSavingRef = useRef(false);

  // Whether another save is required after current request
  const saveQueuedRef = useRef(false);

  // Timer for "saved" -> "idle"
  const savedTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  // --------------------------------------------------
  // GET MONTHLY NOTE
  // --------------------------------------------------

  const { data: noteData } = useQuery({
    queryKey: ["monthly-note", monthID],
    queryFn: () => getMonthlyNote({ monthID }),
    enabled: !!monthID,
  });

  // --------------------------------------------------
  // SET INITIAL NOTE
  // --------------------------------------------------

  useEffect(() => {
    if (!noteData?.success) return;

    const fetchedNote = noteData.note?.note || "";

    serverNoteRef.current = fetchedNote;
    latestNoteRef.current = fetchedNote;

    setMonthlyNote(fetchedNote);
    setLastUpdates(noteData.note?.updatedAt || "");
  }, [noteData]);

  // --------------------------------------------------
  // SAVE FUNCTION
  // --------------------------------------------------

  const saveNote = async (noteToSave: string) => {
    // Don't start another request if one is already running
    if (isSavingRef.current) {
      saveQueuedRef.current = true;
      return;
    }

    // Nothing to save
    if (noteToSave === serverNoteRef.current) {
      return;
    }

    try {
      isSavingRef.current = true;
      saveQueuedRef.current = false;

      setSaveStatus("saving");

      const data = await updateMonthlyNote({
        monthID,
        note: noteToSave,
      });

      if (!data?.success) {
        throw new Error("Failed to update monthly note");
      }

      /*
       * IMPORTANT:
       *
       * Only mark this value as the server value.
       *
       * We DO NOT call setMonthlyNote() here.
       *
       * Therefore, if the user typed something newer while
       * this request was running, their newer text stays intact.
       */
      serverNoteRef.current = noteToSave;

      setLastUpdates(data.note?.updatedAt || "");

      /*
       * Check whether the user typed something newer
       * while this request was running.
       */
      const latestNote = latestNoteRef.current;

      if (latestNote !== noteToSave) {
        /*
         * There is newer unsaved text.
         *
         * Save it immediately instead of waiting for another
         * debounce cycle.
         */
        saveQueuedRef.current = true;

        setSaveStatus("saving");

        await saveNote(latestNote);

        return;
      }

      // Everything is saved
      setSaveStatus("saved");

      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }

      savedTimeoutRef.current = setTimeout(() => {
        setSaveStatus("idle");
      }, 1000);
    } catch (error) {
      console.error(error);

      setSaveStatus("idle");

      notify.error("Please try again.");
    } finally {
      isSavingRef.current = false;
    }
  };

  // --------------------------------------------------
  // DEBOUNCED AUTOSAVE
  // --------------------------------------------------

  useEffect(() => {
    // Nothing changed
    if (monthlyNote === serverNoteRef.current) {
      return;
    }

    const noteToSave = monthlyNote;

    const debounceTimer = setTimeout(() => {
      latestNoteRef.current = noteToSave;

      saveNote(noteToSave);
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [monthlyNote, monthID]);

  // --------------------------------------------------
  // WEBSOCKET SYNC
  // --------------------------------------------------

  useEffect(() => {
    const onNoteUpdate = (data: any) => {
      if (!data?.note) return;

      const serverNote = data.note.note || "";

      /*
       * If the user has unsaved local changes,
       * don't overwrite their editor.
       */
      if (latestNoteRef.current !== serverNoteRef.current) {
        return;
      }

      serverNoteRef.current = serverNote;
      latestNoteRef.current = serverNote;

      setMonthlyNote(serverNote);
      setLastUpdates(data.note.updatedAt || "");
    };

    socket.on("update-monthly-note", onNoteUpdate);

    return () => {
      socket.off("update-monthly-note", onNoteUpdate);
    };
  }, []);

  // --------------------------------------------------
  // CLEANUP
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }
    };
  }, []);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="relative overflow-hidden h-125 rounded-2xl border border-white/10 bg-black/20 w-full flex flex-col justify-between">

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/3 via-transparent to-transparent pointer-events-none" />

      <div>
        {/* Header */}
        <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">

          <div className="flex items-center gap-3">
            <SectionIcon Icon={FiEdit3} />

            <div>
              <p className="text-sm font-bold text-white">
                Monthly Notes
              </p>

              <p className="text-[10px] text-gray-500">
                Reflect on your progress &amp; goals
              </p>
            </div>
          </div>

          {/* Last Updated */}
          {lastUpdated ? (
            <span className="text-[10px] text-indigo-300/90 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 shrink-0">

              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

              {formatTimestamp(lastUpdated)}
            </span>
          ) : (
            <span className="text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 shrink-0">

              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />

              Not Available
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className="relative p-4 flex flex-col gap-3">

          {/* Saving Indicator */}
          <div className="absolute right-6">
            <Saving saveStatus={saveStatus} />
          </div>

          {/* Textarea */}
          <textarea
            value={monthlyNote}
            onChange={(e) => {
              const value = e.target.value;

              setMonthlyNote(value);

              /*
               * Always keep this ref synchronized with
               * what the user currently sees.
               */
              latestNoteRef.current = value;
            }}
            placeholder="Write your thoughts, goals, wins, lessons or motivation for this month..."
            className="
              w-full
              h-94
              text-[12px]
              leading-relaxed
              resize-none
              rounded-xl
              bg-white/5
              border border-white/10
              p-3
              text-white
              placeholder:text-white/20
              outline-none
              focus:border-indigo-500/40
              focus:bg-white/8
              transition-all
              duration-200
              hide-scrollbar
            "
          />

          {/* Footer */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">

            <span className="text-[10px] font-medium text-gray-400">
              {monthlyNote.length} characters
            </span>

            <div className="flex items-center gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                  style={{ opacity: i / 3 }}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyNote;