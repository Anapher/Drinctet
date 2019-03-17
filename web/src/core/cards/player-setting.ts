export class PlayerSetting {
    constructor(public playerIndex: number, public gender: GenderRequirement = "None") {}
}

export type GenderRequirement = 'None' | 'Male' | 'Female' | 'Opposite' | 'Same';
