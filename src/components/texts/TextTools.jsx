import Embed from '@editorjs/embed';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';

const uploadImageByFile = async (e) => {
  const file = e;
  const imageFormData = new FormData();
  imageFormData.append('images', file);
  const endpoint = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/minio`;
  const data = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Type: 'posts',
    },
    body: imageFormData,
  }).then((res) => res.json());

  let images = [];
  await data.images.forEach((element) => {
    images.push(element);
  });
  const url = images[0].url;
  return {
    success: 1,
    file: { url },
  };
};

const uploadImageByUrl = async (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (err) {
      reject(err);
    }
  });

  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },

  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: 'Escribe tu Cabecera',
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
};

export default tools;
