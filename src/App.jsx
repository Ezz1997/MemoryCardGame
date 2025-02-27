import { useState, useEffect } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Images from "./Images";
import "./App.css";
import BlueCard from "./assets/blue-card.png";
import Timer from "./components/Timer";

const UNIQUE_IMAGES_NUM = 6;

export default function App() {
  const [cards, setCards] = useState(new Map());
  const [images, setImages] = useState([]);
  const [imageBuffer, setImageBuffer] = useState(new Map());
  const [isDone, setIsDone] = useState(new Set());
  const [timer, setTimer] = useState("00:20");
  
  // This function Creates a deep copy of the images list, then
  // shuffles them and gets the first N images, and lastly duplicates
  // and concatenates it with shuffled list 
  function updateImages() {
    let temp_images = structuredClone(Images);
    shuffleImages(temp_images);
    temp_images = structuredClone(temp_images.slice(0, UNIQUE_IMAGES_NUM));
    const newImages = temp_images.concat(structuredClone(temp_images));
    shuffleImages(newImages);

    setImages(newImages);
  }

  useEffect(() => {
    updateImages();
  }, []);

  // Fisher-Yates shuffle
  function shuffleImages(images) {
    for (let i = images.length - 1; i >= 1; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [images[i], images[j]] = [images[j], images[i]];
    }
  }


  // This function handles the flipping of a card
  // only 2 images can be flipped at once
  // a buffer is used to save 2 images at most
  // when user selects 2 identical images, 
  // they will be moved to the isDone Set
  function handleFlip(id, imageURL) {
    const newMap = new Map(cards);
    let bufferMap = new Map(imageBuffer);
    const isFlipped = cards.get(id);

    // make sure no more than 2 images are flipped at a time
    if (!isFlipped && bufferMap.size === 2) return;

    newMap.set(id, isFlipped !== undefined ? !isFlipped : true);
    setCards(newMap);

    if (bufferMap.has(id)) {
      bufferMap.delete(id);
    } else {
      bufferMap.set(id, imageURL);
    }

    // check if the 2 images are identical
    if (bufferMap.size === 2) {
      const bufferSet = new Set(bufferMap.values());
      if (bufferSet.size === 1) {
        setIsDone(new Set([...isDone, ...bufferSet]));
        bufferMap = new Map();
      }
    }

    setImageBuffer(bufferMap);
  }

  // resetting game params on new game
  function resetParams() {
    setCards(new Map());
    setImages([]);
    setImageBuffer(new Map());
    setIsDone(new Set());
    setTimer("00:20");

    updateImages();
  }

  return (
    <div className="center-element">
      <Stack
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        <ImageList sx={{ width: 600, height: 520}} cols={4} rowHeight={164}>
          {images.map((item, idx) => (
            <ImageListItem key={idx}>
              <img
                srcSet={
                  cards.get(idx)
                    ? `${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`
                    : `${BlueCard}`
                }
                src={
                  cards.get(idx)
                    ? `${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`
                    : `${BlueCard}`
                }
                alt={item.title}
                loading="lazy"
                onClick={
                  isDone.has(item.img) || timer === "00:00" ? null : () => handleFlip(idx, item.img)
                }
                className={`flip-card ${cards.get(idx) ? "back" : "front"} ${isDone.has(item.img) ? "highlight-correct" : ""}`}
              />
            </ImageListItem>
          ))}
        </ImageList>
        <Button
          sx={{ width: "30%" }}
          variant="contained"
          size="medium"
          onClick={resetParams}
          disabled={!(isDone.size === UNIQUE_IMAGES_NUM || timer === "00:00")}
        >
          Try Again
        </Button>
        {isDone.size === UNIQUE_IMAGES_NUM && <Alert>You Won!</Alert>}
        {(timer === "00:00" && isDone.size !== UNIQUE_IMAGES_NUM) && <Alert severity="error">Game Over!</Alert>}
        <Timer timer={timer} setTimer={setTimer} isGameOver={isDone.size === UNIQUE_IMAGES_NUM || timer === "00:00"}/>
      </Stack>
    </div>
  );
}
