import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { AccademiumException } from 'src/utils/exceptions/accademium.exception';
import { questionAnswers } from '../data/survey-questions.data';

@Injectable()
export class SurveyUtils {
  private readonly logger = new Logger(SurveyUtils.name);

  /**
   * TODO
   * @param answers 
   * @returns 
   */
  formatSurveyAnswers(answers: Record<number, string>): string {
    const questions = Object.keys(questionAnswers);

    return questions
      .map((question, index) => {
        const questionOptions = questionAnswers[question];
        const answerIndex = answers[index + 1];

        if (
          answerIndex !== undefined &&
          questionOptions[answerIndex] !== undefined
        ) {
          return `${index + 1}. ${question}\nAnswer: ${questionOptions[answerIndex]}`;
        } else {
          this.logger.error(
            'Error occurred during the formatting of the survey data.',
          );
          throw new AccademiumException(
            'Failed to format the survey answers!',
            'ANSWERS_FORMAT_FAILURE',
            HttpStatus.BAD_REQUEST,
            'SurveyUtils',
          );
        }
      })
      .join('\n\n');
  }
}
