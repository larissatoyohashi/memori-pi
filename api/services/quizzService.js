import Quizz from "../models/Quizzes.js";

class quizzService {
  async getAll() {
    try {
      const quizzes = await Quizz.find();
      return quizzes;
    } catch (error) {
      console.log(error);
    }
  }

  async Create(
    pergunta,
    checkpointQuizz,
    alternativaA,
    alternativaB,
    alternativaC,
    alternativaD,
    alternativaCorreta
  ) {
    try {
      const newQuizz = new Quizz({
        pergunta,
        checkpointQuizz,
        alternativaA,
        alternativaB,
        alternativaC,
        alternativaD,
        alternativaCorreta,
      });
      await newQuizz.save();
    } catch (error) {
      console.log(error);
    }
  }

  async Delete(id) {
    try {
      await Quizz.findByIdAndDelete(id);
      console.log(`Quizz com id ${id} deletada com sucesso!`);
    } catch (error) {
      console.log(error);
    }
  }

  async getOne(id) {
    try {
      const quizz = await Quizz.findOne({ _id: id });
      return quizz;
    } catch (error) {
      console.log(error);
    }
  }
}
export default new quizzService();
