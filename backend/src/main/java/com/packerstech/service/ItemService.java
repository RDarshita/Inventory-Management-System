package com.packerstech.service;

import com.packerstech.dto.ItemRequest;
import com.packerstech.dto.ItemResponse;

import java.util.List;

public interface ItemService {
    ItemResponse createItem(Long partyId, ItemRequest request);
    List<ItemResponse> getItemsByParty(Long partyId);
    ItemResponse getItemById(Long id);
    ItemResponse updateItem(Long id, ItemRequest request);
    void deleteItem(Long id);
}
