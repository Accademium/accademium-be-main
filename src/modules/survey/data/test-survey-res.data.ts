import { Recommendation } from "../dtos/recommendation-response.dto";
import { ProgramRecommendation } from "../dtos/university-program-response.dto";

export const recommendations: Recommendation[] = [
    {"study_field": "Arts and Culture", "reason": "This field aligns with the individual's primary career interests in Arts and Humanities and long-term goals of pursuing artistic or creative endeavors."},
    {"study_field": "Language and Communication", "reason": "This field supports the individual's desire to develop communication and interpersonal skills, which are essential for making a difference and helping others."},
    {"study_field": "Behaviour and Society", "reason": "This field combines analytical and data-driven work with a focus on understanding human behavior, which resonates with the individual's problem-solving approach and motivation to help others."},
];

export const programRecommendations: ProgramRecommendation[] = [
    {"study_program": "Communication", "reason": "This program aligns with the individual's interest in Arts and Humanities while also focusing on developing communication and interpersonal skills, which they wish to enhance."},
    {"study_program": "International Bachelor Communication and Media", "reason": "This program combines analytical and creative approaches, allowing the individual to engage in collaborative projects while pursuing their artistic and creative career goals."},
    {"study_program": "Literary Studies: Literary and Cultural Analysis", "reason": "This program caters to the individual's passion for the arts and humanities, while also providing opportunities for intuitive insights and creativity in problem-solving through literary analysis."},
];
  