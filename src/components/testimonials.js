export const Testimonials = (props) => {
const  Testimonials= [{
  "img": "img/testimonials/01.jpg",
  "text": "It fits our needs perfectly.  Equvis is the most valuable business resource we have EVER purchased",
  "name": "Jonny Lavato"
},
{
  "img": "img/testimonials/03.jpg",
  "text": "It's exactly what I've been looking for. Equvis has completely surpassed our expectations.",
  "name": "Philip Morris"
},

{
  "img": "img/testimonials/04.jpg",
  "text": "I love your system. Equvis is the next killer app. Thank you so much for your help.",
  "name": "Susan Cropper"
}
]


  return (
    <div id='testimonials'>
      <div className='container'>
        <div className='section-title text-center'>
          <h2>What our clients say</h2>
        </div>
        <div className='row'>
          {Testimonials.map((d, i) => (
                <div key={`${d.name}-${i}`} className='col-md-4'>
                  <div className='testimonial'>
                    <div className='testimonial-image'>
                      {' '}
                      <img src={d.img} alt='' />{' '}
                    </div>
                    <div className='testimonial-content'>
                      <p>"{d.text}"</p>
                      <div className='testimonial-meta'> - {d.name} </div>
                    </div>
                  </div>
                </div>
              ))
            }
        </div>
      </div>
    </div>
  )
}
