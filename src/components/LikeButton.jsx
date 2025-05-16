import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToLiked, removeFromLiked } from "../store/likedSlice";

const LikeButton = ({ countryData }) => {
  const dispatch = useDispatch();
  const likedCountries = useSelector((state) => state.liked.likedCountries);
  const isLiked = likedCountries.some(
    (country) => country.code === countryData.code
  );

  const handleClick = () => {
    if (isLiked) {
      dispatch(removeFromLiked(countryData.code));
    } else {
      dispatch(addToLiked(countryData));
    }
  };

  return (
    <button className="absolute right-3 cursor-pointer" onClick={handleClick}>
      <Heart
        size={30}
        fill={isLiked ? "red" : "none"}
        color="red"
        strokeWidth={3}
      />
    </button>
  );
};

export default LikeButton;
