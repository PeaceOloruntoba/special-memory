interface DefaultProps {
  pageTitle: string;
}

export default function Default({ pageTitle }: DefaultProps) {
  return (
    <div className="w-full p-6 space-y-6 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex flex-col">
        <span className="font-semibold text-xl">{pageTitle}</span>
      </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-2xl text-black/80 font-semibold animate-pulse">
            Coming Soon...
          </span>
          <div className="text-gray-700 text-lg">
            All hands are on deck to bring to you the best fashion design
            software tool.
            <br />
            Please navigate to other pages for more features. as we work on this
            feature.
          </div>
        </div>
    </div>
  );
}
