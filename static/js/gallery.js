/**
 * Dynamic Gallery Rendering Engine for EasyCarHireNaija
 */

document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('galleryContainer');
    if (!galleryContainer) return;

    renderGallery();

    function renderGallery() {
        galleryContainer.innerHTML = cars.map(car => `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 border-0 shadow-hover car-card">
                    <div class="position-relative overflow-hidden">
                        <img src="${car.image}" class="card-img-top" alt="${car.name}">
                        <span class="badge bg-dark position-absolute top-0 end-0 m-3 rounded-pill px-3 py-2">₦${car.price}/day</span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${car.name}</h5>
                        <p class="card-text text-muted small">${car.description}</p>
                        
                        <!-- Reviews Sample (Teaching Point) -->
                        <div class="mb-3">
                            <small class="text-muted d-block mb-1">Recent Review:</small>
                            <p class="fst-italic small mb-0">"${car.reviews.length > 0 ? car.reviews[0].comment : 'No reviews yet'}"</p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <a href="car-details.html" class="btn btn-primary rounded-pill px-4">View Details</a>
                            <div class="text-warning">
                                <i class="bi bi-star-fill"></i> ${car.rating}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
});
