import UserScript from '../models/userScript';
import LanguageStatus from '../models/languageStatus';

import { uploadFile } from '../services/s3';

export const createUserScript = async (request, response) => {
  try {
    const files = request.files; // 多分arryaになっているだろう。
    const userId = request.params.id;

    files.forEach((file) => {
      uploadFile(file);
    });

    const userScript = await UserScript.create({
      user: userId,
      conversationTranscriptFileName: files[0].filename,
      learningLanguageScriptFileName: files[1].filename,
      nativeLanguageScriptFileName: files[2].filename,
    });

    response.status(201).json({
      userScript,
    });
  } catch (error) {
    console.log(error);
  }
};
