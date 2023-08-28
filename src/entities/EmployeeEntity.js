import BaseEntity from './BaseEntity';

class EmployeeEntity extends BaseEntity {
	constructor() {
		super();
		this.id = null;
		this.first_name = null;
		this.last_name = null;
		this.full_name = null;
		this.phone = null;
		this.email = null;
		this.password = null;
		this.salt = null;
		this.birthday = null;
		this.avatar = null;
		this.token = null;
		this.status = null;
		this.gender = null;
	}
}
export default EmployeeEntity;