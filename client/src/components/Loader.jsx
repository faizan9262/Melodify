import { motion } from "framer-motion";
import { FaPlay, FaMusic } from "react-icons/fa6";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative flex justify-center items-center">
        {/* Pulsing Play Button */}
        <motion.div
          className="flex justify-center items-center w-16 h-16 bg-white text-[#7B3F00] rounded-full relative"
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: ["0px 0px 0px rgba(255,255,255,0.5)", "0px 0px 15px rgba(255,255,255,0.5)", "0px 0px 0px rgba(255,255,255,0.5)"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FaPlay className="text-2xl" />
        </motion.div>

        {/* Floating Music Notes */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white text-3xl"
            initial={{ opacity: 0, scale: 0.5, y: 0, x: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.8],
              x: [0, (i % 2 === 0 ? 40 : -40)], // Random left/right direction
              y: [0, (i % 2 === 0 ? -50 : 50)], // Random up/down direction
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          >
            <FaMusic />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
