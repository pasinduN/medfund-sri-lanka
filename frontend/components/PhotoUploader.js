"use client";

import { useState } from "react";

const MAX_GALLERY = 6;
let nextId = 0;

export default function PhotoUploader() {
  const [mainPhoto, setMainPhoto] = useState(null);
  const [gallery, setGallery] = useState([]);

  const handleMain = (e) => {
    const file = e.target.files[0];
    if (file) setMainPhoto(URL.createObjectURL(file));
  };

  const handleGallery = (e) => {
    const files = [...e.target.files];
    setGallery((prev) => {
      const room = MAX_GALLERY - prev.length;
      const added = files.slice(0, room).map((f) => ({ id: nextId++, url: URL.createObjectURL(f) }));
      return [...prev, ...added];
    });
    e.target.value = "";
  };

  const remove = (id) => setGallery((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="photorow">
      <label className="mainphoto">
        {mainPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mainPhoto} alt="Patient photo" />
        ) : (
          <span>📷<br />Main photo<br /><small>tap to upload</small></span>
        )}
        <input type="file" name="mainPhoto" accept="image/*" hidden onChange={handleMain} />
      </label>

      <div className="thumbs">
        {gallery.map((photo) => (
          <div className="thumb" key={photo.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt="Gallery photo" />
            <button type="button" title="Remove" onClick={() => remove(photo.id)}>✕</button>
          </div>
        ))}
        {gallery.length < MAX_GALLERY && (
          <label className="addthumb">
            ＋
            <input type="file" accept="image/*" multiple hidden onChange={handleGallery} />
          </label>
        )}
      </div>
    </div>
  );
}