import { Injectable } from '@nestjs/common';

import { OpenAI } from "openai";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AIClient {
    private readonly openai: OpenAI;

    constructor(
        private configService: ConfigService
    ) {
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>('OPENAI_API_KEY'),
        });  
    }

  async getRecommendations(surveyAnswers: string, studyFields: string[]): Promise<any> {
    const prompt = `Based on the answers provided in the orientation survey below, recommend three study fields from the predefined study fields that would be the most suitable for the individual. 
    Orientation Survey Questions and Answers:
    ${surveyAnswers}

    Predefined Study Fields: ${studyFields.join(', ')}

    Please provide the recommendations in the following JSON format:

    {
        "recommendations": [
            {
                "study_field": "Field 1",
                "reason": "Reason for recommending Field 1 based on the orientation survey answers."
            },
            {
                "study_field": "Field 2",
                "reason": "Reason for recommending Field 2 based on the orientation survey answers."
            },
            {
                "study_field": "Field 3",
                "reason": "Reason for recommending Field 3 based on the orientation survey answers."
            }
        ]
    }`;

    return this.getAIResponse(prompt);
  }

  async getUniversityProgramRecommendations(surveyAnswers: string, universityPrograms: string[]): Promise<any> {
    const prompt = `Based on the answers provided in the orientation survey below, recommend three university programs from the predefined university program list that would be the most suitable for the individual. 
    Orientation Survey Questions and Answers:
    ${surveyAnswers}

    Predefined University Programs: ${universityPrograms.join(', ')}

    Please provide the recommendations in the following JSON format:

    {
        "program_recommendations": [
            {
                "study_program": "Program 1",
                "reason": "Reason for recommending Program 1 based on the orientation survey answers."
            },
            {
                "study_program": "Program 2",
                "reason": "Reason for recommending Program 2 based on the orientation survey answers."
            },
            {
                "study_program": "Program 3",
                "reason": "Reason for recommending Program 3 based on the orientation survey answers."
            }
        ]
    }`;

    return this.getAIResponse(prompt);
  }

  private async getAIResponse(prompt: string): Promise<any> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system', 
          content: 'You are an expert in education and career counseling.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2
    });

    return JSON.parse(response.choices[0].message.content);
  }
}