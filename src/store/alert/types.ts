export interface IErrorData {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    error?:string;
    campaign?:string;
    errors?: {
        Name?: string[];
        email?: string[];
        Password?: string[];
    };
}
export interface IAlert {
    id?: string;
    name: string;
    msg: IErrorData;
    alertType?: string;
    timeout?: number;
}

export interface AlertState extends Array<IAlert> {}
export enum AlertTypes {
    SET_ALERT = 'SET_ALERT',
    REMOVE_ALERT = 'REMOVE_ALERT',
    CLEAR_ALERT = 'CLEAR_ALERT'
}

interface SetAlertAction {
    type: typeof AlertTypes.SET_ALERT;
    payload: IAlert;
}

interface RemoveAlertAction {
    type: typeof AlertTypes.REMOVE_ALERT;
    payload: string;
}

interface ClearAlertAction {
    type: typeof AlertTypes.CLEAR_ALERT;
}

export type AlertActionTypes = SetAlertAction | RemoveAlertAction | ClearAlertAction;
