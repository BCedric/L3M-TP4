import {Component, Input, OnInit, ViewChild, ElementRef}               from "@angular/core";
import {Chose, ListeChoses as ListeChosesNF} 	from "@NoyauFonctionnel/nf";
import {ListeChosesService}                     from "@NoyauFonctionnel/service";

const htmlTemplate = `
	<section class="todoapp">
		<header class="header">
			<h1>{{titre}}</h1>
			<form (ngSubmit)="appendChose( newTodo.value )" >
				<input class="new-todo" placeholder="Que faire?" #newTodo autofocus>
			</form>
		</header>
		<section class="main">
			<input  class="toggle-all"
			        type="checkbox"
							(change) = selectItems()
							#select
							/>
			<label for="toggle-all">Mark all as complete</label>
			<ul class="todo-list">
				<li *ngFor="let c of getChoses()" [class.completed] = "c.fait" [class.editing] = "item.editing">
					<item-chose [nf]="c" #item ></item-chose>
				</li>

      </ul>
		</section>
        <footer class="footer">
            <span class="todo-count"><strong></strong>{{getRestantes()}} restantes</span>
            <ul class="filters">
                <li>
                    <a (click) = "setFilterAll()">Tous</a>
                </li>
                <li>
                    <a (click) = "setFilterActive()">Actifs</a>
                </li>
                <li>
                    <a (click) = "setFilterCompleted()">Complétés</a>
                </li>
            </ul>
            <button class="clear-completed" (click) = "supprimerCoches()">Supprimer cochées</button>
        </footer>
	</section>
	<hr/>
	<section>
	    <section *ngFor="let chose of getChoses()">
	        {{chose.fait}} : {{chose.texte}}
        </section>
	</section>
`;

type filterChose = (c : Chose) => boolean;
@Component({
  selector		: "liste-choses",
  template		: htmlTemplate
})
export class ListeChoses implements OnInit {
    @Input() titre	: string;
    public nf       : ListeChosesNF;
    private choses  : Chose[] = [];

		@ViewChild("select") select : ElementRef;
		@ViewChild("newTodo") newTodo : ElementRef;

		filterAll : filterChose = (c) => true;
		filterCompleted : filterChose = (c) => c.fait;
		filterActive : filterChose = (c) => !c.fait;
		filter : filterChose;

	constructor		(private serviceListe: ListeChosesService) {
		 this.filter = this.filterAll;
	};
    ngOnInit(): void {
        ListeChosesService.getData().then( (nf) => {
            this.nf     = nf;
            this.choses = nf.choses;
        });
    };

    getChoses() : Chose[] {
        return this.choses.filter(this.filter);
    };

		getRestantes() : number {
			return this.choses.filter(this.filterActive).length;
		}

		appendChose(texte) : void {
			console.log("Ajouter");
			this.newTodo.nativeElement.value ="";
			this.nf.Ajouter(texte);
		}

		supprimerCoches() : void {
			this.choses.filter(this.filterCompleted).forEach((e)=>this.nf.Retirer(e));
		}

		selectItems() : void {
			this.choses.forEach((e)=>e.fait = this.select.nativeElement.checked);
		}

		setFilterAll() : void {
			this.filter = this.filterAll;
		}

		setFilterCompleted() : void {
			this.filter = this.filterCompleted;
		}

		setFilterActive() : void {
			this.filter = this.filterActive;
		}
}
