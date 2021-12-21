import Meeting from '../models/meeting';

export const createMeeting = async (request, response) => {
  try {
    const { organizer, language1, language2, title, description } = request.body;
    const meeting = await new Meeting({
      organizer,
      language1,
      language2,
      title,
      description,
    });

    meeting.members[0] = organizer;
    meeting.save();
    response.json({
      meeting,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMeetings = async (request, response) => {
  try {
    const meetings = await Meeting.find();
    response.json({
      meetings,
    });
  } catch (error) {
    console.log(error);
  }
};
