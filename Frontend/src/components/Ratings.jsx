import StarRating from "react-star-ratings";
export const showAverageRating = (p) => {
  if (p && p.ratings) {
    let ratingsArray = p && p.ratings;

    let total = [];

    let length = ratingsArray.length;
    ratingsArray.map((r) => total.push(r.star));
    let totalReduced = total.reduce((p, n) => p + n, 0);
    let highest = length * 5;
    let result = (totalReduced * 5) / highest;

    console.log("result", result)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "5px",
        }}
      >
       {result ?  <span>
          <StarRating
            starSpacing="2px"
            starRatedColor="#d1411e"
            starDimension="18px"
            rating={result}
            editing={false}
          />
          ({length})
        </span> : ""}
      </div>
    );
  }
};