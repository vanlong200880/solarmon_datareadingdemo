import BaseEntity from './BaseEntity';

class LanguageEntity extends BaseEntity {
	constructor() {
		super();
		this.id = null;
		this.name = null;
		this.iso_code = null;
		this.status = null;
		this.default = null;
	}
}
export default LanguageEntity;