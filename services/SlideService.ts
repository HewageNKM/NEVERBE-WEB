import { otherRepository } from "@/repositories/OtherRepository";

/**
 * SlideService - Thin wrapper over OtherRepository
 * Delegates data access to repository layer
 */

export const getSliders = () => otherRepository.getSliders();
