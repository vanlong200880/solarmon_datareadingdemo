import BaseEntity from './BaseEntity';

class ModelTechedgeEntity extends BaseEntity {
	constructor() {
		super();
		this.time = null;
		this.id_device = null;
		this.memPercent = null;
		this.memTotal = null;
		this.memUsed = null;
		this.memAvail = null;
		this.memFree = null;
		this.diskPercent = null;
		this.diskTotal = null;
		this.diskUsed = null;
		this.diskFree = null;
		this.cpuTemp = null;
		this.upTime = null;
	}
}
export default ModelTechedgeEntity;