import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const SongContext = createContext();

export const SongProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState(null);
  const [albums, setAlbums] = useState([]);

  const [selectedSong, setSelectedSong] = useState(null);
  const [index, setIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [songLoading, setSongLoading] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);

  async function fetchSongs() {
    try {
      const { data } = await axios.get("/api/song/all");

      const songsList = Array.isArray(data) ? data : [];

      setSongs(songsList);
      setIsPlaying(false);

      if (songsList.length > 0) {
        setSelectedSong(songsList[0]._id);
        setIndex(0);
      } else {
        setSelectedSong(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchSingleSong(id) {
    if (!id) return;

    setSongLoading(true);

    try {
      const { data } = await axios.get("/api/song/single/" + id);
      setSong(data);
    } catch (error) {
      console.log(error);
    } finally {
      setSongLoading(false);
    }
  }

  useEffect(() => {
    if (selectedSong) {
      fetchSingleSong(selectedSong);
    }
  }, [selectedSong]);

  useEffect(() => {
    if (!selectedSong || !songs.length) return;

    const i = songs.findIndex((s) => s._id === selectedSong);
    if (i !== -1) setIndex(i);
  }, [selectedSong, songs]);

  function nextMusic() {
    if (!songs.length) return;

    const newIndex = index === songs.length - 1 ? 0 : index + 1;

    setIndex(newIndex);
    setSelectedSong(songs[newIndex]?._id);
    setIsPlaying(true);
  }

  function prevMusic() {
    if (!songs.length) return;

    const newIndex = index === 0 ? songs.length - 1 : index - 1;

    setIndex(newIndex);
    setSelectedSong(songs[newIndex]?._id);
    setIsPlaying(true);
  }

  async function fetchAlbums() {
    try {
      const { data } = await axios.get("/api/song/album/all");
      setAlbums(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  }

  async function addSong(
    formData,
    setTitle,
    setDescription,
    setFile,
    setSinger,
    setAlbum
  ) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/song/new", formData);

      toast.success(data.message);

      fetchSongs();

      setTitle("");
      setDescription("");
      setSinger("");
      setAlbum("");
      setFile("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error adding song");
    } finally {
      setLoading(false);
    }
  }

  async function addAlbum(formData, setTitle, setDescription, setFile) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/song/album/new", formData);

      toast.success(data.message);
      fetchAlbums();

      setTitle("");
      setDescription("");
      setFile("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error adding album");
    } finally {
      setLoading(false);
    }
  }


  async function addThumbnail(id, formData, setFile) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/song/" + id, formData);

      toast.success(data.message);
      fetchSongs();
      setFile("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error uploading thumbnail");
    } finally {
      setLoading(false);
    }
  }

  async function deleteSong(id) {
    try {
      const { data } = await axios.delete("/api/song/" + id);

      toast.success(data.message);
      fetchSongs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting song");
    }
  }

  const [albumSong, setAlbumSong] = useState([]);
  const [albumData, setAlbumData] = useState(null);

  async function fetchAlbumSong(id) {
    try {
      const { data } = await axios.get("/api/song/album/" + id);

      setAlbumSong(data?.songs || []);
      setAlbumData(data?.album || null);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, []);

  return (
    <SongContext.Provider
      value={{
        songs,
        song,
        albums,
        loading,
        songLoading,
        selectedSong,
        setSelectedSong,
        isPlaying,
        setIsPlaying,
        nextMusic,
        prevMusic,
        addSong,
        addAlbum,
        addThumbnail,
        deleteSong,
        fetchAlbumSong,
        albumSong,
        albumData,
        fetchSongs,
        fetchAlbums,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const SongData = () => useContext(SongContext);
