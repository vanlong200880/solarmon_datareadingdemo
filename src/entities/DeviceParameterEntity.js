import BaseEntity from './BaseEntity';

class DeviceParameterEntity extends BaseEntity {
	constructor() {
		super();
		this.id = null;
		this.id_device_group = null;
		this.name = null;
		this.slug = null;
		this.unit = null;
		this.status = 1;
		this.error_code = null;
		this.created_date = null;
		this.created_by = null;
		this.updated_date = null;
		this.updated_by = null;
		
	}
}
export default DeviceParameterEntity;