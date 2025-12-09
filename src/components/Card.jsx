import { Link } from "react-router-dom";

export default function Card({ id, title, img }) {
  return (
    <Link
      to={`/quiz/${id}/1`}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-[280px] flex flex-col"
    >
      <img
        className="w-full h-[65%] object-cover"
        src={img}
        alt={title}
      />

      <div className="p-4 flex flex-col justify-between flex-1">
        <h2 className="text-lg font-semibold mb-1 text-gray-700">{title}</h2>
        <p className="text-gray-700 text-sm">Klik untuk mulai kuis</p>
      </div>
    </Link>
  );
}
