import { mc } from '@/lib/minio';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// Put a file in bucket my-bucketname.
export const uploadToBucket = async (file, fileLocation) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const path = join('/', 'tmp', file.name);

  await writeFile(path, buffer);

  console.log('test');

  return new Promise((resolve, reject) => {
    mc.fPutObject('shopout', fileLocation, path, function (err, result) {
      if (err) {
        console.log('Error from minio', err);
        reject(err);
      } else {
        // console.log('Success uploading images to minio');
        resolve({
          _id: result._id, // Make sure _id and url are properties of the result object
          etag: result.etag,
        });
      }
    });
  });
};
