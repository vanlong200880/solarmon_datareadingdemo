import BaseEntity from './BaseEntity';

class ErrorEntity extends BaseEntity {
	constructor() {
		super();
		this.id = null;
		this.id_error_level = null;
		this.id_error_type = null;
		this.id_device_group = null;
		this.id_error_state = null;
		this.status = 1;
		this.error_code = null;
		this.created_date = null;
		this.created_by = null;
		this.updated_date = null;
		this.updated_by = null;
		
	}
}
export default ErrorEntity;