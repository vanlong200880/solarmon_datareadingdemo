import BaseEntity from './BaseEntity';

class ModelInverterSMASTP50Entity extends BaseEntity {
	constructor() {
		super();
		this.time = null;
		this.id_device = null;
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
		this.dailyEnergy = null;
		this.dcCurrent = null;
		this.dcVoltage = null;
		this.dcPower = null;
		this.internalTemperature = null;
		this.mppt1Current = null;
		this.mppt1Voltage = null;
		this.mppt1Power = null;
		this.mppt2Current = null;
		this.mppt2Voltage = null;
		this.mppt2Power = null;
		this.mppt3Current = null;
		this.mppt3Voltage = null;
		this.mppt3Power = null;
		this.mppt4Current = null;
		this.mppt4Voltage = null;
		this.mppt4Power = null;
		this.mppt5Current = null;
		this.mppt5Voltage = null;
		this.mppt5Power = null;
		this.mppt6Current = null;
		this.mppt6Voltage = null;
		this.mppt6Power = null;
	}
}
export default ModelInverterSMASTP50Entity;