export class DirectorModel implements IDirectorModel {
    stage: number;
    ready: number;

    get currentStage(): number {
        return this.ready === 0 ? 0 : this.stage;
    }

    constructor(obj: IDirectorModel) {
        this.stage = obj.stage;
        this.ready = obj.ready;
    }
}

export interface IDirectorModel {
    stage: number;
    ready: number;
}
