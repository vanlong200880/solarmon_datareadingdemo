import BaseEntity from './BaseEntity';

class ModelEmeterVinasinoVSE3T5Entity extends BaseEntity {
	constructor() {
		super();
		this.time = null;
		this.id_device = null;
		this.activeEnergy = null;
		this.activeEnergyRate1 = null;
		this.activeEnergyRate2 = null;
		this.activeEnergyRate3 = null;
		this.reactiveEnergyInductive = null;
		this.reactiveEnergyInductiveRate1 = null;
		this.reactiveEnergyInductiveRate2 = null;
		this.reactiveEnergyInductiveRate3 = null;
		this.reactiveEnergyCapacitive = null;
		this.reactiveEnergyCapacitiveRate1 = null;
		this.reactiveEnergyCapacitiveRate2 = null;
		this.reactiveEnergyCapacitiveRate3 = null;
		this.currentPhaseA = null;
		this.currentPhaseB = null;
		this.currentPhaseC = null;
		this.voltagePhaseA = null;
		this.voltagePhaseB = null;
		this.voltagePhaseC = null;
		this.powerFrequency = null;
		this.activePower = null;
		this.reactivePower = null;
		this.powerFactor = null;
		this.activePowerPhaseA = null;
		this.activePowerPhaseB = null;
		this.activePowerPhaseC = null;
		this.reactivePowerPhaseA = null;
		this.reactivePowerPhaseB = null;
		this.reactivePowerPhaseC = null;
		this.activePowerMaxDemand = null;
		this.activePowerMaxDemandRate1 = null;
		this.activePowerMaxDemandRate2 = null;
		this.activePowerMaxDemandRate3 = null;
		this.powerFactorPhaseA = null;
		this.powerFactorPhaseB = null;
		this.powerFactorPhaseC = null;
		this.CTratioPrimary = null;
		this.CTratioSecondary = null;
		this.PTratioPrimary = null;
		this.PTratioSecondary = null;
	}
}
export default ModelEmeterVinasinoVSE3T5Entity;