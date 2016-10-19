import { Component, Input, ViewChild, ElementRef } from "@angular/core";
import {Chose} from "@NoyauFonctionnel/nf";

const htmlTemplate = `
	<div class="view">
		<input 	class			= "toggle"
				type			= "checkbox"
				(change) = selectItem()
				[ngModel] = "nf.fait"
				#select
				/>
		<label 	(dblclick)="modeEdition()" class="texte" >{{nf.texte}}</label>
		<button class="destroy" (click)="supprimer()"></button>
	</div>
	<form (ngSubmit) = setText(newText.value)>
		<input class="edit" #newText />
	</form>
`;

@Component({
  selector		: "item-chose",
  template		: htmlTemplate
})
export class ItemChose {
	editing : boolean = false;
	@ViewChild("newText") newText : ElementRef;
	@ViewChild("select") select : ElementRef;

	//attribut passé dans la balise
	@Input() 	nf		: Chose;

	modeEdition() : void {
		this.editing = true;
		this.newText.nativeElement.value = this.nf.texte;
		requestAnimationFrame(()=>this.newText.nativeElement.focus());
	};

	supprimer() : void {
		this.nf.liste.Retirer(this.nf);
	};

	setText(newTexte){
		this.editing = false;
		this.nf.texte = newTexte;
	};

	selectItem() : void {
		this.nf.fait = this.select.nativeElement.checked;
	};
	
};
