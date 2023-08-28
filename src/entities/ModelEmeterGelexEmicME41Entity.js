import BaseEntity from './BaseEntity';

class ModelEmeterGelexEmicME41Entity extends BaseEntity {
	constructor() {
		super();
		this.time = null;
		this.id_device = null;
		this.activeEnergy = null;
		this.activeEnergyExport = null;
		this.activeEnergyExportRate1 = null;
		this.activeEnergyExportRate2 = null;
		this.activeEnergyExportRate3 = null;
		this.activeEnergyImport = null;
		this.activeEnergyImportRate1 = null;
		this.activeEnergyImportRate2 = null;
		this.activeEnergyImportRate3 = null;
		this.reactiveEnergyExport = null;
		this.reactiveEnergyImport = null;
		this.voltagePhaseA = null;
		this.voltagePhaseB = null;
		this.voltagePhaseC = null;
		this.currentPhaseA = null;
		this.currentPhaseB = null;
		this.currentPhaseC = null;
		this.powerFactor = null;
		this.activePower = null;
	}
}
export default ModelEmeterGelexEmicME41Entity;