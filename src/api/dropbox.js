import { Dropbox } from "dropbox";

export const DROPBOX_TOKEN_NAME = "plog.dropbox.token";
let dbx = new Dropbox({
  clientId: process.env.REACT_APP_CLIENT_ID,
  accessToken: localStorage.getItem(DROPBOX_TOKEN_NAME),
});

export { dbx };

export const logout = () => {
  dbx.authTokenRevoke();
  localStorage.removeItem(DROPBOX_TOKEN_NAME);
};

export const saveToken = (accessToken) => {
  localStorage.setItem(DROPBOX_TOKEN_NAME, accessToken);
  dbx = new Dropbox({
    clientId: process.env.REACT_APP_CLIENT_ID,
    accessToken,
  });
};

export const getUser = () => {
  return dbx.usersGetCurrentAccount().then(({ result }) => {
    return result;
  });
};

export const testToken = () =>
  dbx.usersGetCurrentAccount().then(() => true, () => false);

export const createPost = (tag, fileName) =>
  dbx.fileRequestsCreate({
    title: fileName,
    destination: `/${tag}`,
    open: false,
  });

export const createTag = (tag) =>
  dbx.filesCreateFolderV2({ path: `/${tag}`, autorename: true });

export const renameTag = (tag, newName) =>
  dbx.filesMoveV2({
    from_path: `/${tag}`,
    to_path: `/${newName}`,
    autorename: true,
  });

export const renamePost = (post, newName) => {
  return dbx.filesMoveV2({
    from_path: `${post.path_lower}`,
    to_path: `${post.path_lower.substring(
      0,
      post.path_lower.lastIndexOf("/")
    )}/${newName}`,
    autorename: true,
  });
};

export const deleteTag = (tag) => dbx.filesDeleteV2({ path: `/${tag}` });

export const fetchTags = () =>
  dbx
    .filesListFolder({ path: "" })
    .then(({ result }) =>
      result.entries.filter((file) => file[".tag"] === "folder")
    );

export const fetchPosts = (tagName) =>
  dbx.filesListFolder({ path: `/${tagName}` }).then(({ result }) => {
    return result.entries.filter((file) => file[".tag"] === "file");
  });

export const fetchPost = (file) =>
  dbx.filesDownload({ path: file }).then(({ result }) => {
    const temporaryFileReader = new FileReader();
    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new Error("Problem parsing input file."));
      };
      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsText(result.fileBlob);
    });
  });

export const deleteFile = (file) => dbx.filesDeleteV2({ path: file });

export const pushFile = (file, text) =>
  dbx
    .filesUpload({
      path: file,
      contents: text,
      mode: { ".tag": "overwrite" },
      autorename: false,
    })
    .then((data) => {
      console.log("synced", data);
    })
    .catch((error) => {
      console.error(error);
    });
