import { RiScissorsLine } from "react-icons/ri";

export default function Logo() {
  return (
    <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="flex items-center gap-2">
        <RiScissorsLine className="h-8 w-8 text-white" />
        <span className="text-xl font-bold text-white">Kunibi</span>
      </div>
    </div>
  );
}
