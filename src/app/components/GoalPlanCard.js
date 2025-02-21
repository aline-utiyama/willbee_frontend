"use client";

const GoalPlanCard = ({ goalPlan, onClick }) => {
  const creatorName = goalPlan.creator || "Anonymous";

  return (
    <div onClick={onClick} className="cursor-pointer bg-white shadow-md rounded-lg p-4 flex flex-col justify-items-start gap-3">
      <div className="flex ">
        <img
          alt="Goal Plan image"
          src="https://img.freepik.com/free-vector/arrow-hitting-target_1034-50.jpg?ga=GA1.1.813922924.1739959609&semt=ais_hybrid"
          className="size-12 flex-none rounded-full bg-gray-50"
        />
        <div className="flex flex-col ml-4">
          <h2 className="text-xl font-bold text-gray-900">{goalPlan.title}</h2>
          <p className="text-sm text-gray-600">by {creatorName}</p>
        </div>
      </div>

      <p className="text-lg text-gray-600">{goalPlan.purpose}</p>

      <div className="flex justify-end mt-2 items-center">
        <p className="text-sm text-gray-600 mr-2">See more</p>
        <div className="flex items-center justify-center bg-yellow-400 rounded-full p-1.5 border-2 border-black shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right-short" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GoalPlanCard;
