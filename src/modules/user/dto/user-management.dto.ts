export class CreateUserDto {
    cognito_id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    date_of_birth?: Date;
    phone?: string;
    address?: string;
    nationality?: string;
    language_skills?: Record<string, string>;
    current_education_level?: string;
}
  
export class UpdateUserDto {
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    nationality?: string;
    language_skills?: Record<string, string>;
    current_education_level?: string;
}