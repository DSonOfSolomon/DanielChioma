document.getElementById('year').textContent= new Date().getFullYear();

function handleSubmit(e){
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const status = document.getElementById('form-status');
    const email = 'dchioma01@qub.ac.uk';
    const subject = encodeURIComponent('Portfolio contact from ' + data.get('name'));
    const body = encodeURIComponent('Name: ' + data.get('name') + '\n\nMessage:\n' + data.get('message') + '\n\nEmail: ' + data.get('email'));
    const mailto = `mailto:${email}?subject=${subject}&body=${body}`;
    status && (status.textContent = 'Opening your email client...');
    window.location.href = mailto;
    setTimeout(()=>{ status && (status.textContent = 'If nothing opened, email me at' + email) },1500);   
}

document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
        const id = a.getAttribute('href');
        if(id.length>1){
            e.preventDefault();
            document.querySelector(id).scrollIntoView({behavior:'smooth',block:'start'});
        }

    });
});

const modal = document.getElementById('contact-modal');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('modal-close');
openModalBtn.addEventListener('click', ()=>{ modal.style.display = 'flex'; });
closeModalBtn.addEventListener('click', ()=>{ modal.style.display = 'none'; });
window.addEventListener('click', (e)=>{ if(e.target === modal) modal.style.display = 'none'; });