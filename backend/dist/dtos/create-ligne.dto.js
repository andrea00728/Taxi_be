var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import "reflect-metadata";
export class CreateLigneDto {
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLigneDto.prototype, "nom", void 0);
__decorate([
    IsNumber(),
    __metadata("design:type", Number)
], CreateLigneDto.prototype, "tarif", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateLigneDto.prototype, "depart", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateLigneDto.prototype, "terminus", void 0);
__decorate([
    IsNumber(),
    __metadata("design:type", Number)
], CreateLigneDto.prototype, "district_id", void 0);
//# sourceMappingURL=create-ligne.dto.js.map