import BaseEntity from './BaseEntity';

class ModelInverterSMASHP75Entity extends BaseEntity {
	constructor() {
		super();
		this.time = null;
		this.id_device = null;
		this.acCurrent = null;
		this.currentPhaseA = null;
		this.currentPhaseB = null;
		this.currentPhaseC = null;
		this.voltagePhaseA = null;
		this.voltagePhaseB = null;
		this.voltagePhaseC = null;
		this.activePower = null;
		this.powerFrequency = null;
		this.apparentPower = null;
		this.reactivePower = null;
		this.powerFactor = null;
		this.activeEnergy = null;
		this.dcCurrent = null;
		this.dcVoltage = null;
		this.dcPower = null;
		this.internalTemperature = null;
		this.heatSinkTemperature = null;
		this.transformerTemperature = null;
	}
}
export default ModelInverterSMASHP75Entity;