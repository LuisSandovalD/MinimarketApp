export default function Spinner({ size = 8 }) {
  return (
    <div
      className={`border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin w-${size} h-${size}`}
    ></div>
  );
}
