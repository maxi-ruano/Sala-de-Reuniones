  
console.log(localStorage.getItem('params'));
  var params  = localStorage.getItem('params')

 

function cartel(){
    Swal.fire({
        title:  params + " connected.",
        // text : "proyecto api demixer" ,
        // icon : 'success' ,
        icon : 'success' ,
        width : '350px',
        top : 0,
      toast : true ,
      backdrop : true,
      position : "center" ,
    showConfirmButton : false,
    timer : 2000 ,

        
    })
}


function desconectado(){
    Swal.fire ({
        title: params + " disconnected." ,
        // text : "proyecto api demixer" ,
        // icon : 'success' ,
        icon : 'warning' ,
        width : '350px',
      toast : true ,
      backdrop : true,
      position : "center" ,
    showConfirmButton : false,
    timer : 4000 ,

        
    })
    
}
