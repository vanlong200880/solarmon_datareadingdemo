import BaseEntity from './BaseEntity';

class DeviceGroupEntity extends BaseEntity {
	constructor() {
		super();
		this.id = null;
		this.name = null;
		this.table_name = null;
		this.code_prefix = null;
		this.status = 1;
		this.created_date = null;
		this.created_by = null;
		this.updated_date = null;
		this.updated_by = null;
		
	}
}
export default DeviceGroupEntity;