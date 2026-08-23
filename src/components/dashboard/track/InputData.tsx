import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { notify } from "../../../helper";
import { updateTaskName } from "../../../api/dashboard.api";
import Saving from "../../shared/Saving";

export const InputData = ({
  index,
  taskId,
  taskName,
}: {
  index: number;
  taskId: string;
  taskName: string;
}) => {
  const [value, setValue] = useState<string>(taskName);

  // Value confirmed by the server
  const serverValueRef = useRef(taskName);

  // Latest value typed by the user
  const latestValueRef = useRef(taskName);

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateTaskMutation = useMutation({
    mutationFn: updateTaskName,

    onMutate: () => {
      setSaveStatus("saving");

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },

    onSuccess: (_, variables) => {
      /*
       * IMPORTANT:
       *
       * Only consider this request as the current
       * server value if the user hasn't typed something
       * newer.
       */
      if (latestValueRef.current === variables.taskName) {
        serverValueRef.current = variables.taskName;

        setSaveStatus("saved");

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setSaveStatus("idle");
        }, 1000);
      }
    },

    onError: () => {
      setSaveStatus("idle");
      notify.error("Please try again.");
    },
  });

  // --------------------------------------------------
  // DEBOUNCED AUTOSAVE
  // --------------------------------------------------

  useEffect(() => {
    // Nothing changed
    if (value === serverValueRef.current) {
      return;
    }

    const valueToSave = value;

    const timeout = setTimeout(() => {
      latestValueRef.current = valueToSave;

      updateTaskMutation.mutate({
        taskId,
        taskName: valueToSave,
      });
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, taskId]);

  // --------------------------------------------------
  // SYNC WITH PARENT
  // --------------------------------------------------

  useEffect(() => {
    /*
     * Don't blindly overwrite local changes.
     *
     * If parent gives us a different taskName while the
     * user has unsaved changes, keep the user's value.
     */
    if (latestValueRef.current !== serverValueRef.current) {
      return;
    }

    serverValueRef.current = taskName;
    latestValueRef.current = taskName;

    setValue(taskName);
  }, [taskName]);

  // --------------------------------------------------
  // CLEANUP
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div
      className="
        text-[12px]
        px-2
        p-1
        flex
        items-center
        gap-2
        border-b
        border-darkBox/50
        light:border-lightBorder
      "
    >
      <span>{index + 1}.</span>

      <input
        type="text"
        className="outline-none w-full py-1"
        title={value}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;

          setValue(newValue);

          // Always keep track of what the user currently typed
          latestValueRef.current = newValue;

          setSaveStatus("saving");
        }}
      />

      <Saving saveStatus={saveStatus} />
    </div>
  );
};