import { motion, AnimatePresence } from "framer-motion";

export default function RightDrawer({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Drawer</h2>
                <button onClick={() => setOpen(false)}>✕</button>
              </div>

              <p className="text-sm text-gray-600">
                This is a smooth right-side drawer. You can put any content here.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}