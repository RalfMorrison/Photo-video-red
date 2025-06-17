import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [music, setMusic] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 20);
    setPhotos(files);
  };

  const handleMusicUpload = (e) => {
    setMusic(e.target.files[0]);
  };

  const handleGenerateVideo = async () => {
    if (!music || photos.length === 0) {
      alert("Загрузите фото и музыку");
      return;
    }

    const formData = new FormData();
    photos.forEach((photo) => formData.append("photos", photo));
    formData.append("music", music);

    setLoading(true);
    setVideoUrl(null);

    try {
      const response = await axios.post("http://localhost:8000/generate", formData, {
        responseType: 'blob'
      });
      const url = URL.createObjectURL(new Blob([response.data]));
      setVideoUrl(url);
    } catch (err) {
      alert("Ошибка генерации видео");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold mb-4">Создание видео из фото и музыки</h1>

        <label className="block mb-2 font-medium">Загрузите до 20 фотографий:</label>
        <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="mb-4" />

        <label className="block mb-2 font-medium">Загрузите музыкальный файл (mp3):</label>
        <input type="file" accept="audio/*" onChange={handleMusicUpload} className="mb-4" />

        <button onClick={handleGenerateVideo} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Сгенерировать видео
        </button>

        {loading && <p className="mt-4 text-blue-600">Генерация видео...</p>}

        {videoUrl && (
          <div className="mt-6">
            <video controls src={videoUrl} className="w-full rounded-xl" />
            <a
              href={videoUrl}
              download="generated_video.mp4"
              className="block mt-2 text-center text-white bg-green-600 px-4 py-2 rounded-lg"
            >
              Скачать видео
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
