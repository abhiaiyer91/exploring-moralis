import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useMoralis } from "../hooks/useMoralis";

const formStyle = {
  height: 40,
  width: `98%`,
};

const formWrapper = {
  marginBottom: 16,
};

const labelButton = {
  color: `black`,
  backgroundColor: `rgb(197,250,3)`,
  padding: `0.5rem`,
  borderRadius: `0.3rem`,
  cursor: `pointer`,
  marginTop: `1rem`,
};

const button = {
  borderRadius: `4px`,
  border: `1px solid rgb(247, 248, 250)`,
  backgroundColor: `rgb(255, 255, 255)`,
  height: `40px`,
  width: `100%`,
  cursor: `pointer`,
};

export function ProfileForm() {
  const { Moralis } = useMoralis();
  const { currentUser } = useAuth();

  const user = currentUser();

  const [formState, setForm] = useState({
    avatar: ``,
    identity: user?.get(`identity`) || ``,
    bio: user?.get(`bio`) || ``,
  });

  async function saveProfileImage() {
    if (!formState?.avatar) {
      return;
    }

    const file = new Moralis.File(formState?.avatar?.name, formState?.avatar);
    await file.saveIPFS();

    user.set("avatar", file);
  }

  async function onSubmit() {
    await saveProfileImage();
    user.set("bio", formState?.bio);
    user.set("identity", formState?.identity);
    await user.save();
  }

  let imgUrl = user?.get(`avatar`)?._url;

  if (formState?.avatar) {
    imgUrl = URL.createObjectURL(formState?.avatar);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        return onSubmit();
      }}
      style={{ maxWidth: 320, margin: `0 auto` }}
    >
      <div style={{ marginBottom: `32px` }}>
        {imgUrl && (
          <div style={{ maxWidth: 320, marginBottom: 16 }}>
            <img src={imgUrl} style={{ maxWidth: `100%`, height: `auto` }} />
          </div>
        )}

        <input
          id="avatarInput"
          name="avatar"
          type="file"
          onChange={(e) => {
            const [fileSrc] = e.currentTarget.files;
            if (!fileSrc) {
              return;
            }

            setForm({
              ...formState,
              avatar: fileSrc,
            });
          }}
          hidden
        />
        <label htmlFor="avatarInput" style={labelButton}>
          Upload an Avatar Picture
        </label>
      </div>
      <div style={formWrapper}>
        <input
          name="identity"
          type="text"
          style={formStyle}
          value={formState?.identity}
          onChange={(e) => {
            setForm({
              ...formState,
              identity: e.currentTarget.value,
            });
          }}
          placeholder="Captain Underpants"
        />
      </div>
      <div style={formWrapper}>
        <textarea
          name="bio"
          type="text"
          style={formStyle}
          value={formState?.bio}
          onChange={(e) => {
            setForm({
              ...formState,
              bio: e.currentTarget.value,
            });
          }}
          placeholder="Superhuman Strength, Flight"
        />
      </div>

      <button type="submit" style={button}>
        Save
      </button>
    </form>
  );
}
