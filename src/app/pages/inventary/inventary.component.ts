import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastMessageService } from 'src/app/components/message/service/toast-message.service';
import { IAction } from 'src/app/components/table/model/action';
import { IBook } from 'src/app/models/book';
import { BookService } from 'src/app/services/book.service';
import { handleErrors } from '../helpers/handleerrors';
import { MainServiceService } from 'src/app/services/main-service.service';

@Component({
  selector: 'app-inventary',
  templateUrl: './inventary.component.html',
  styleUrls: ['./inventary.component.css']
})
export class InventaryComponent implements OnInit{

  noImage:string="../../../assets/noimage.png";
  books:any[]=[];
  booksFound:any[]=[];
  hiddenLoad:boolean=true;
  hiddenTable:boolean=false;
  hiddenEmpty:boolean=true;
  checkedTituloAutor:boolean=true;
  checkedIsxn:boolean=false;
  

  tableAction:IAction={
    icon:'../../../assets/settings.svg',
    redirect:'/new-book'
  }
  tableHeaders=[
    'Imagen', 'Isxn', 'Titulo', 'Autor', 'Editorial', 'Categoria', 'Publicación', 'Unidades', 'Costo'
  ]

  constructor(
    private bookService:BookService,
    private mainService:MainServiceService,
    private router:Router,
    private toastMessageService:ToastMessageService
  ){
  }

  searchForm= new FormGroup({
    string: new FormControl('',[Validators.required])
  })

  
  ngOnInit(): void {
    this.findAll();
  }

  checkTituloAutor(){
    this.checkedTituloAutor=true;
    this.checkedIsxn=false;
    if(this.searchForm.value.string){
      this.search(this.searchForm.value.string)
    }
   }
   checkIsxn(){
    this.checkedTituloAutor=false;
    this.checkedIsxn=true;
    if(this.searchForm.value.string){
      this.search(this.searchForm.value.string)
    }
   }
  finishLoad(){
    if(this.booksFound.length>0){
      this.hiddenEmpty=true;
      this.hiddenTable=false;
      this.hiddenLoad=true;

    }else{
      this.hiddenEmpty=false;
      this.hiddenTable=true;
      this.hiddenLoad=true;

    }
  }
  startLoad(){
      this.hiddenEmpty=true;
      this.hiddenTable=true;
      this.hiddenLoad=false;

    
  }
  findAll(){
    this.startLoad();
    this.mainService.get('book').subscribe(
      (data:any)=>{
        this.books=this.mapBooksForTable(data.response)||[];
        this.booksFound=this.books;
        this.finishLoad();
      },(error)=>{
        handleErrors(error, this.toastMessageService)
      }
    )
  }

  async search(string:any){
    this.startLoad();
    if(this.checkedTituloAutor==true&&this.searchForm.valid){
      await this.findByAuthorYTitle(string);
    }else if(this.checkedIsxn==true&&this.searchForm.valid){
      await this.findByIsxn(string);
    }else{
      this.booksFound=this.books;
      this.finishLoad();
    }
  }

  findByIsxn(isxn:string){
    this.booksFound=[];
    this.books.forEach((book:any)=>{
      const bookTags:string=book.Isxn;
      if(bookTags.includes(isxn)){
        this.booksFound.push(book);
      }
    });
    this.finishLoad();
  }
  
  findByAuthorYTitle(string:any){
    this.booksFound=[];
    this.books.forEach((book:any)=>{
      const bookTags:string=book.Titulo+' '+book.Autor+' '+book.Editorial;
      if(bookTags.toLowerCase().includes(string.toLowerCase())){
        this.booksFound.push(book);
      }
    });
    this.finishLoad();
  }
  getBook(id:number){
    this.router.navigate(['/new-book'],{queryParams:{id:id}})
  }
  mapBooksForTable(bookList:any){
    return bookList.map((book:IBook)=>({
      Imagen:String(book.image),
      Isxn:String(book.isxn),
      Titulo:String(book.title),
      Autor:String(book.author),
      Editorial:String(book.editorial),
      Categoria:String(book.category.name),
      Publicación:String(book.publicationDate),
      Unidades:String(book.units),
      Costo:String(book.cost)+' COP'
    }));
  }
}
