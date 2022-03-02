import UserScript from '../models/userScript';
import Conversation from '../models/conversation';
import LanguageStatus from '../models/languageStatus';

// import { uploadFile } from '../services/s3';
import { uploadScriptFile } from '../services/s3';

export const createUserScript = async (request, response) => {
  try {
    const files = request.files; // 多分arryaになっているだろう。
    const userId = request.params.id;

    // files.forEach((file) => {
    //   uploadFile(file);
    // });

    const userScript = await UserScript.create({
      user: userId,
      conversationTranscriptFileName: files[0].filename,
      learningLanguageScriptFileName: files[1].filename,
      nativeLanguageScriptFileName: files[2].filename,
    });

    // conversationIdもparamsとかから送って、そのidからconversationを見つけて、ここでもうupdateしちゃう。今までとは異なり、もうわけない。一気にやる。
    const conversation = await Conversation.findById(request.params.conversationId);
    conversation.userScripts.push(userScript);
    await conversation.save();

    // ここのs3変えないとな。
    files.forEach((file) => {
      uploadScriptFile(file);
    });

    response.status(201).json({
      userScript,
    });
  } catch (error) {
    console.log(error);
  }
};
