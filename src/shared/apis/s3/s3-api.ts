import { get } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

interface PresignedUrlResponse {
  url: string;
  key: string;
}

export const getPresignedUrl = async (fileName: string): Promise<PresignedUrlResponse> => {
  return get<PresignedUrlResponse>(END_POINT.S3_PRESIGNED_URL, {
    params: { fileName },
    headers: {
      'Trace-Id': uuidv4(),
    },
  });
};

export const uploadToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  await axios.put(presignedUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
};

export const uploadImage = async (file: File): Promise<string> => {
  const data = await getPresignedUrl(file.name);

  // await uploadToS3(data.url, file);

  const S3_BUCKET_URL = 'https://bookbook-booklink.s3.ap-northeast-2.amazonaws.com';
  return `${S3_BUCKET_URL}/${data.key}`;
};
