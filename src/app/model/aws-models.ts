export interface Project {
    id: string;
    datsetName: string;
    datasetDesc: string;
    datasetOwnerEmail: string;
    datasetFileSize: number;
    datasetFileName: string;
    datasetContainsPhi: boolean;
    datasetContainsHumanSubjects: boolean;
    datasetProtocolType: string; // IRB / IEC / EXEMPT / EXEMPTWITHWAIVER
    datasetProtocolId: string;
    datasetPublic: boolean;
}

export interface Permission {
    permissionProjectId: string;
    permissionEmail: string;
    permissionType: string; // ADMIN / READONLY
}

export interface User {
    permissionEmail: string;
    oauthToken: string;
    awsAccessToken: string;
    awsIdToken: string;
    awsRefreshToken: string;
}

export class UploadService {

    private _user: User;

    public login(oauth: string): Promise<User> {
        return new Promise((resolve, reject) => { });
    }

    public getProjects(): Promise<Array<Project>> {
        return new Promise((resolve, reject) => { });
    }
    public saveProject(file: any, project: Project): Promise<Project> {
        // Create + Update  "if (project.id === null) {"
        return new Promise((resolve, reject) => { });
    }
    public deleteProject(project: Project): Promise<Project> {
        return new Promise((resolve, reject) => { });
    }

    public getPermissions(project: Project): Promise<Array<Permission>> {
        return new Promise((resolve, reject) => { });
    }
    public savePermission(permission: Permission): Promise<Permission> {
        // Update + Create
        return new Promise((resolve, reject) => { });
    }
    public deletePermission(permission: Permission): Promise<Permission> {
        return new Promise((resolve, reject) => { });
    }

    private isSessionActive(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => { });
    }

    private refreshSession(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

        });
    }
}
