import { useRef, useState } from "react";
import PinataClient from "../../services/pinata";
import colors from "../../styles/colors";
import CloudUpload from "../icons/CloudUpload";
import Toast from "./Toast";
import ImageCrop from "./images/ImageCrop";

// type Dimensions = {
//   width: number;
//   height: number;
// };

// const validateDimensions = (
//   image: HTMLImageElement,
//   dimensions: Dimensions
// ) => {
//   const { naturalHeight, naturalWidth } = image;

//   return (
//     naturalHeight === dimensions.height && naturalWidth === dimensions.width
//   );
// };

export type Dimensions = {
  width: number;
  height: number;
};

export default function ImageInput({
  label,
  dimensions,
  existingImg,
  circle,
  info,
  imgHandler,
}: {
  label: string;
  dimensions: Dimensions;
  existingImg?: string;
  circle?: Boolean;
  info?: string;
  imgHandler: (file: Blob) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [tempImg, setTempImg] = useState<string | undefined>();
  const [imgSrc, setImgSrc] = useState<string | undefined>();
  const [croppedImg, setCroppedImg] = useState<string | undefined>();
  const [validation, setValidation] = useState({
    error: false,
    msg: "",
  });

  const handleDragEnter = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const getFiles = (e: any) => {
    if (e.dataTransfer) {
      return e.dataTransfer.files;
    }
    return e.currentTarget?.files;
  };

  const saveImage = (
    e: React.DragEvent<HTMLButtonElement> | React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const files = getFiles(e);
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => reader.result && setImgSrc(reader.result.toString() || "")
      );
      reader.readAsDataURL(files[0]);
      setTempImg(files[0]);
    }
  };

  const blobExistingImg = async (imgUrl: string) => {
    const img = await fetch(imgUrl);
    const blob = await img.blob();
    imgHandler(blob);
  };

  const currentImg = () => {
    if (tempImg) return tempImg;
    if (!existingImg) return "";

    const pinataClient = new PinataClient();
    const imgUrl = pinataClient.fileURL(existingImg);

    blobExistingImg(imgUrl);
    return imgUrl;
  };

  const onButtonClick = () => {
    if (typeof fileInput.current?.click === "function") {
      fileInput.current.click();
    }
  };

  return (
    <>
      <div className="mt-6 w-full">
        <label className="text-sm" htmlFor={label}>
          {label}
        </label>
        <legend>{info}</legend>
        <div className="flex">
          <input
            ref={fileInput}
            onChange={(e) => saveImage(e)}
            className="hidden"
            type="file"
            name="file"
            accept=".png,.jpg"
          />
          {fileInput && (
            <button
              className="w-2/3 border border-dashed rounded flex flex-col py-6 items-center mr-2"
              type="button"
              onClick={onButtonClick}
              onDrop={(e) => saveImage(e)}
              onDragOver={(e) => handleDragOver(e)}
              onDragEnter={(e) => handleDragEnter(e)}
              onDragLeave={(e) => handleDragLeave(e)}
            >
              <CloudUpload color={colors["secondary-text"]} />
              <p>Click to Upload or drag and drop</p>
              <p>
                PNG or JPG (Required:{" "}
                {`${dimensions.width}px x ${dimensions.height}px`})
              </p>
            </button>
          )}
          <div className="w-1/3">
            {croppedImg && (
              <img
                className={`max-h-28 ${circle && "rounded-full"}`}
                src={croppedImg ?? currentImg()}
                alt="Project Logo Preview"
              />
            )}
          </div>
        </div>
      </div>
      <Toast
        show={validation.error}
        error
        fadeOut
        onClose={() =>
          setValidation({
            error: false,
            msg: "",
          })
        }
      >
        <p className="font-semibold text-quaternary-text mr-2 mt-1">
          {validation.msg}
        </p>
      </Toast>
      {imgSrc !== undefined && (
        <ImageCrop
          isOpen={imgSrc !== undefined}
          imgSrc={imgSrc ?? ""}
          dimensions={dimensions}
          onClose={() => console.log("youuu")}
          onCrop={(imgUrl) => setCroppedImg(imgUrl)}
        />
      )}
    </>
  );
}
