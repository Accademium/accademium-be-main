import { Injectable } from '@nestjs/common';
import { Application, ApplicationKey } from '../interfaces/application.interface';
import { InjectModel, Model, UpdatePartial } from 'nestjs-dynamoose';

@Injectable()
export class ApplicationRepository {
    constructor(
        @InjectModel('Application')
        private applicationModel: Model<Application, ApplicationKey>
    ) {}

    /**
     * Find all applications for a specific user
     * @param userId - The ID of the user
     * @returns Promise<Application[]> - A list of applications
     */
    async findAllByUserId(
        userId: string
    ): Promise<Application[]> {
        return this.applicationModel.query('userId').eq(userId).exec();
    }

    /**
     * Find a specific application by user ID and application ID
     * @param userId - The ID of the user
     * @param applicationId - The ID of the application
     * @returns Promise<Application | null> - The application or null if not found
     */
    async findByUserIdAndApplicationId(
        userId: string, 
        applicationId: ApplicationKey
    ): Promise<Application> {
        const result = await this.applicationModel.query('userId').eq(userId).where('applicationId').eq(applicationId).exec();
        return result[0] || null;    
    }

    /**
     * Update the status of an application
     * @param userId - The ID of the user
     * @param applicationId - The ID of the application
     * @param status - The new status
     * @returns Promise<Application | null> - The updated application or null if not found
     */
    async updateStatus(
        applicationId: ApplicationKey, 
        application: UpdatePartial<Application>
    ): Promise<Application> {
        // return null;
        // update(key: UserKey, user: Partial<User>) {
        return this.applicationModel.update(
            applicationId, 
            application
        );
        //   }
        // return this.applicationModel.update(
        //     { userId, applicationId }, 
        //     { status, lastUpdatedDate: new Date() },
        //     { ReturnValues: 'ALL_NEW' }
        // );
    }

    /**
     * Create a new application
     * @param application - The application data
     * @returns Promise<Application> - The created application
     */
    async save(
        application: Application
    ): Promise<Application> {
        return this.applicationModel.create(application);
    }
}