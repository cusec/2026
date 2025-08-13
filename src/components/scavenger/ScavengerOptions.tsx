interface ScavengerOptionsProps {
  dbUser?: {
    _id: string;
    email: string;
    name?: string;
    points: number;
    history: string[];
  } | null;
}

const ScavengerOptions = ({ dbUser }: ScavengerOptionsProps) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {dbUser && (
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Points:{" "}
            <span className="font-semibold text-primary">{dbUser.points}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Items Found: {dbUser.history.length}
          </p>
        </div>
      )}
      <button className="px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/80 transition">
        Create Hunt Item
      </button>
      <button className="px-4 py-2 rounded-lg bg-accent text-white font-semibold shadow hover:bg-accent/80 transition">
        Find Items
      </button>
    </div>
  );
};

export default ScavengerOptions;
